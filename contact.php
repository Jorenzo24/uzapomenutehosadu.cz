<?php
/**
 * Formulaire d'intérêt : U zapomenutého sadu
 * - validation serveur
 * - anti-spam : honeypot + délai minimal de remplissage
 * - envoi d'un e-mail à la cliente
 * - copie du lead dans un CSV hors de public_html (repli : dossier data/ protégé par .htaccess)
 * - redirection vers la page de confirmation
 */

declare(strict_types=1);

// ---------- Configuration ----------
const LEAD_TO      = '[EMAIL CLIENTE À CONFIRMER]';           // TODO : adresse qui reçoit les demandes
const LEAD_FROM    = 'formulaire@uzapomenutehosadu.cz';       // TODO : adresse d'envoi existante sur le serveur
const SITE_NAME    = 'U zapomenutého sadu';
const MIN_SECONDS  = 3;                                       // délai minimal entre affichage et envoi
const PAGE_SUCCESS = 'merci/';
const PAGE_FORM    = './';

$INTERESTS = [
    'terrain' => 'Acheter un terrain près de Prague',
    'maison'  => 'Acheter une maison près de Prague',
    'neuf'    => 'Une construction neuve',
    'un-an'   => 'Une livraison sous un an',
];

// ---------- Helpers ----------
function redirect(string $to): void
{
    header('Location: ' . $to, true, 303);
    exit;
}

function field(string $key, int $max): string
{
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    $v = trim(str_replace(["\r", "\0"], '', $v));
    return mb_substr($v, 0, $max);
}

/** Neutralise l'injection de formules dans le CSV (Excel, LibreOffice). */
function csv_safe(string $v): string
{
    return preg_match('/^[=+\-@\t]/', $v) ? "'" . $v : $v;
}

/** Dossier de stockage : hors de public_html si possible. */
function leads_dir(): ?string
{
    $candidates = [dirname(__DIR__) . '/leads', __DIR__ . '/data'];
    foreach ($candidates as $dir) {
        if (is_dir($dir) || @mkdir($dir, 0750, true)) {
            if (is_writable($dir)) {
                return $dir;
            }
        }
    }
    return null;
}

// ---------- Contrôles ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    redirect(PAGE_FORM);
}

// Honeypot rempli ou envoi trop rapide : on fait semblant que tout va bien.
$elapsed = (time() * 1000 - (int) ($_POST['t'] ?? 0)) / 1000;
if (field('site_web', 200) !== '' || $elapsed < MIN_SECONDS) {
    redirect(PAGE_SUCCESS);
}

$nom       = field('nom', 120);
$email     = field('email', 160);
$telephone = field('telephone', 40);
$terrain   = field('terrain', 2);
$message   = field('message', 2000);
$consent   = ($_POST['consentement'] ?? '') === '1';

$interets = [];
if (isset($_POST['interets']) && is_array($_POST['interets'])) {
    foreach ($_POST['interets'] as $i) {
        if (is_string($i) && isset($INTERESTS[$i])) {
            $interets[] = $INTERESTS[$i];
        }
    }
}

if (
    mb_strlen($nom) < 2
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !$consent
    || ($terrain !== '' && !preg_match('/^[1-7]$/', $terrain))
    || ($telephone !== '' && !preg_match('/^[0-9 +().\-\/]{6,40}$/', $telephone))
) {
    redirect(PAGE_FORM . '?erreur=champs#contact');
}

$date = date('Y-m-d H:i:s');
$ip   = $_SERVER['REMOTE_ADDR'] ?? '';

// ---------- Sauvegarde CSV ----------
$saved = false;
$dir = leads_dir();
if ($dir !== null) {
    $file = $dir . '/leads.csv';
    $isNew = !file_exists($file);
    $fh = @fopen($file, 'ab');
    if ($fh !== false) {
        flock($fh, LOCK_EX);
        if ($isNew) {
            fwrite($fh, "\xEF\xBB\xBF"); // BOM UTF-8 pour Excel
            fputcsv($fh, ['date', 'nom', 'email', 'telephone', 'terrain', 'interets', 'message', 'consentement', 'ip'], ';');
        }
        $saved = fputcsv($fh, array_map('csv_safe', [
            $date, $nom, $email, $telephone, $terrain, implode(' | ', $interets), $message, 'oui', $ip,
        ]), ';') !== false;
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

// ---------- E-mail ----------
$subject = 'Nouvelle demande : ' . SITE_NAME . ($terrain !== '' ? " (terrain $terrain)" : '');
$body = implode("\n", [
    'Nouvelle demande depuis le site ' . SITE_NAME,
    '',
    'Date : ' . $date,
    'Nom : ' . $nom,
    'E-mail : ' . $email,
    'Téléphone : ' . ($telephone !== '' ? $telephone : '-'),
    'Terrain : ' . ($terrain !== '' ? $terrain : 'pas de préférence'),
    'Intérêts : ' . ($interets ? implode(', ', $interets) : '-'),
    '',
    'Message :',
    $message !== '' ? $message : '-',
    '',
    'Consentement RGPD donné le ' . $date . '.',
]);

$headers = [
    'From: ' . SITE_NAME . ' <' . LEAD_FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = false;
if (filter_var(LEAD_TO, FILTER_VALIDATE_EMAIL)) {
    $sent = @mail(
        LEAD_TO,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $body,
        implode("\r\n", $headers),
        '-f' . LEAD_FROM
    );
}

// Le lead est conservé si l'un des deux a fonctionné.
if (!$saved && !$sent) {
    redirect(PAGE_FORM . '?erreur=envoi#contact');
}

redirect(PAGE_SUCCESS);
