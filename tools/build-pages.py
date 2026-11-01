#!/usr/bin/env python3
"""Génération statique du shell commun. Aucune dépendance Python tierce."""
from pathlib import Path
from html import escape
import json
ROOT=Path(__file__).resolve().parent.parent

def icon(name):
    return f'<svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons.svg#{name}"></use></svg>'

NAV=[('index.html','Accueil'),('menaces.html','Menaces'),('apprendre.html','Apprendre'),('quiz.html','Quiz'),('conseils.html','Conseils')]

def logo():
    return f'<a href="index.html" class="logo" aria-label="TchatzSafe, accueil">{icon("shield")}<span class="brand-word">Tchatz<span>Safe</span></span></a>'

def header(page):
    def links(items):
        return ''.join(f'<a href="{path}" class="nav-link{" active" if path==page else ""}"'+(' aria-current="page"' if path==page else '')+f'>{label}</a>' for path,label in items)
    current=' aria-current="page"' if page=='progression.html' else ''
    return f'''<header class="site-header"><div class="container header-inner">{logo()}<nav class="nav-desktop" aria-label="Navigation principale">{links(NAV)}</nav><div class="header-actions"><a href="progression.html" class="btn btn-secondary progress-link"{current}>{icon('user')}Ma progression</a><button type="button" class="btn btn-secondary install-header" data-install-app>{icon('install')}Installer TchatzSafe</button><a href="analyser.html" class="btn btn-primary">{icon('scan')}Analyser une menace</a><button class="icon-button theme-toggle" data-theme-toggle type="button" aria-label="Activer le thème clair">{icon('sun')}</button><button type="button" class="icon-button menu-toggle" aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded="false">{icon('menu')}</button></div></div><dialog id="mobile-menu" class="mobile-menu" aria-labelledby="mobile-menu-title"><h2 id="mobile-menu-title" class="sr-only">Menu de navigation</h2><div class="mobile-menu-top">{logo()}<button type="button" class="icon-button" data-close-menu aria-label="Fermer le menu">{icon('close')}</button></div><nav aria-label="Navigation mobile">{links(NAV+[('glossaire.html','Glossaire'),('progression.html','Ma progression'),('signaler.html','Signalement · démo')])}</nav><div class="mobile-menu-bottom"><a href="analyser.html" class="btn btn-primary btn-block">{icon('scan')}Analyser une menace</a><button type="button" class="btn btn-secondary btn-block mobile-install" data-install-app>{icon('install')}Installer TchatzSafe</button><p>Gratuit. Sans compte. À votre rythme.</p></div></dialog></header>'''

def footer():
    def links(items,external=False):
        return '<ul>'+''.join(f'<li><a href="{path}"'+(' target="_blank" rel="noopener noreferrer"' if external else '')+f'>{label}'+(icon('external')+'<span class="sr-only"> (nouvel onglet)</span>' if external else '')+'</a></li>' for path,label in items)+'</ul>'
    return f'''<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand">{logo()}<p>Comprendre les pièges numériques.<br>Adopter les bons réflexes, chaque jour.<br>La cybersécurité, accessible à tous.</p><button type="button" class="btn btn-secondary footer-install" data-install-app>{icon('install')}Installer TchatzSafe</button><p class="footer-privacy">VOTRE VIE PRIVÉE COMPTE.</p></div><div class="footer-col"><h2>Explorer</h2>{links([('menaces.html','Bibliothèque des menaces'),('apprendre.html','Les formations'),('quiz.html','Les quiz'),('conseils.html','Conseils pratiques'),('glossaire.html','Glossaire'),('progression.html','Ma progression')])}</div><div class="footer-col"><h2>TchatzSafe</h2>{links([('a-propos.html','Notre mission'),('analyser.html','Analyseur · démo'),('signaler.html','Signalement · démo'),('sources.html','Sources et fiabilité'),('confidentialite.html','Confidentialité'),('moderation.html','Modération · démo locale')])}<button class="footer-settings" type="button" data-analytics-settings>Gérer la mesure d’audience</button></div><div class="footer-col"><h2>Sources utiles</h2>{links([('https://www.cybermalveillance.gouv.fr/','Cybermalveillance.gouv.fr'),('https://www.cnil.fr/','CNIL'),('https://cyber.gouv.fr/','ANSSI'),('https://www.cnin.bj/','CNIN · Bénin'),('https://vercel.com/dashboard','Statistiques · accès Vercel')],True)}</div></div><div class="footer-bottom"><p>Un outil éducatif, pas une garantie de sécurité. En cas d’incident, contactez le service concerné ou l’autorité compétente de votre pays.</p><p>Copyright <span data-year>2026</span> TchatzSafe</p></div></div></footer>'''

COMMON=['js/services/storage.js','js/main.js','js/pwa.js','js/analytics.js']
LEARN=['js/data/sources.js','js/data/lessons.js','js/data/quizzes.js','js/data/curriculum.js','js/progress.js','js/components.js']
PAGES={
'index.html':('TchatzSafe — Les arnaques évoluent. Votre vigilance aussi.','Apprenez à reconnaître les menaces numériques, testez vos réflexes et découvrez comment protéger vos données.',LEARN+['js/data/threats.js','js/quiz.js','js/pages/home.js']),
'apprendre.html':('Apprendre — TchatzSafe','17 formations de cybersécurité, organisées en niveaux débutant, intermédiaire et avancé.',LEARN+['js/pages/learning.js']),
'menaces.html':('Bibliothèque des menaces — TchatzSafe','Comprendre les fraudes Mobile Money, faux emplois, phishing, faux investissements, faux comptes et liens suspects.',['js/data/sources.js','js/data/threats.js','js/components.js','js/pages/threats.js']),
'quiz.html':('Tester mes réflexes — TchatzSafe','Des quiz de cybersécurité accessibles, avec explications après chaque réponse.',LEARN+['js/quiz.js','js/pages/quizzes.js']),
'progression.html':('Ma progression — TchatzSafe','Retrouvez vos leçons, scores, XP et badges, enregistrés uniquement sur cet appareil.',LEARN+['js/pages/progression.js']),
'analyser.html':('Examiner une menace — TchatzSafe','Une démonstration locale et transparente pour lire les indices d’un lien, message ou numéro suspect.',['js/services/threat-rules.js','js/pages/analyzer.js']),
'signaler.html':('Préparer un signalement — TchatzSafe','Préparez un brouillon privé sur cet appareil. Aucun envoi réel ni publication automatique.',['js/services/threat-rules.js','js/services/reports-repository.js','js/pages/reports.js']),
'moderation.html':('Atelier de modération locale — TchatzSafe','Démonstration du parcours de traitement des brouillons locaux, sans serveur, vérification ou publication.',['js/services/threat-rules.js','js/services/reports-repository.js','js/pages/reports.js']),
'conseils.html':('Conseils pratiques — TchatzSafe','Des réflexes simples pour protéger vos comptes, vos données et vos paiements.',['js/pages/advice.js']),
'glossaire.html':('Glossaire — TchatzSafe','Les mots de la cybersécurité expliqués simplement, sans prérequis.',['js/data/glossary.js','js/glossary.js']),
'a-propos.html':('Notre mission — TchatzSafe','Rendre la sensibilisation à la cybersécurité accessible au grand public, notamment en Afrique. ',[]),
'confidentialite.html':('Confidentialité — TchatzSafe','Ce que TchatzSafe conserve sur votre appareil et ce que cette version ne transmet jamais.',['js/services/threat-rules.js','js/services/reports-repository.js','js/pages/privacy.js']),
'sources.html':('Sources et fiabilité — TchatzSafe','Nos références publiques, notre méthode éditoriale et les limites des outils proposés.',['js/data/sources.js','js/pages/sources.js']),
'404.html':('Page introuvable — TchatzSafe','Retrouvez les formations et les outils TchatzSafe.',[]),
'hors-ligne.html':('Hors connexion — TchatzSafe','Retrouvez les contenus disponibles sur votre appareil.',[])
}
CSP="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"

def build():
    for filename,(title,description,scripts) in PAGES.items():
        source=ROOT/'templates/pages'/filename
        if not source.exists():
            raise SystemExit(f'Template manquant : {source}')
        body=source.read_text()
        styles='\n'.join(f'<link rel="stylesheet" href="css/{name}.css">' for name in ['reset','variables','style','components','responsive','refresh'])
        tags='\n'.join(f'<script src="{path}" defer></script>' for path in COMMON+scripts)
        noindex='<meta name="robots" content="noindex,nofollow">' if filename in ['moderation.html','404.html','hors-ligne.html'] else ''
        canonical='' if noindex else f'<link rel="canonical" href="https://tchatzsafe.vercel.app/{"" if filename=="index.html" else filename}">'
        base_tag='<base href="/">' if filename=='hors-ligne.html' else ''
        html=f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
{base_tag}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description,quote=True)}"><meta name="theme-color" content="#101114"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="{escape(CSP,quote=True)}">
<meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(description,quote=True)}"><meta property="og:type" content="website"><meta property="og:locale" content="fr_BJ"><meta property="og:image" content="https://tchatzsafe.vercel.app/assets/illustrations/hero-vigilance.jpg"><meta name="twitter:card" content="summary_large_image">{noindex}{canonical}
<link rel="icon" href="assets/favicon/favicon.svg" type="image/svg+xml"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="assets/pwa/apple-touch-icon.png"><link rel="preload" href="assets/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>
<script src="js/theme-init.js"></script>
{styles}
{tags}
</head>
<body>
<a href="#main" class="skip-link">Aller au contenu principal</a>
{header(filename)}
<section id="analytics-consent" class="analytics-consent" aria-labelledby="analytics-title" hidden><div class="container analytics-inner"><div><h2 id="analytics-title" tabindex="-1">Votre choix pour la mesure d’audience</h2><p>Avec votre accord, Vercel mesure les visites de façon agrégée pour nous aider à améliorer le site. Aucun contenu de formulaire n’est transmis. <a href="confidentialite.html#mesure-audience">En savoir plus</a>.</p><p id="analytics-choice-status" class="analytics-status" role="status"></p></div><div class="analytics-actions"><button type="button" class="btn btn-secondary btn-sm" data-analytics-decline>Refuser</button><button type="button" class="btn btn-primary btn-sm" data-analytics-accept>Autoriser</button></div></div></section>
<div class="network-banner" id="offline-status" role="status" hidden><div class="container">{icon('offline')} Hors connexion : les contenus déjà mis en cache restent disponibles sur cet appareil.</div></div>
<div class="network-banner" id="pwa-error" role="status" hidden><div class="container">Le mode hors connexion n’a pas pu être activé. Le site reste utilisable en ligne.</div></div>
<div class="update-banner" id="update-status" role="status" hidden><div class="container"><p>Une nouvelle version de TchatzSafe est disponible.</p><button type="button" class="btn btn-secondary btn-sm" data-update-app>Mettre à jour</button></div></div>
<div class="storage-banner" id="storage-banner" role="status" hidden><div class="container"><p></p><button type="button" class="btn btn-secondary btn-sm mt-4" data-export-session hidden>Exporter la progression de cette page</button></div></div>
<div class="storage-banner" id="app-error-banner" role="alert" hidden><div class="container"><p>Un élément nécessaire de la page n’a pas pu être chargé. Les interactions peuvent être indisponibles. Aucun envoi de formulaire n’a eu lieu.</p><button type="button" class="btn btn-secondary btn-sm mt-4" data-reload-page>Actualiser la page</button></div></div>
<noscript><div class="noscript-message">Les interactions (cours, quiz et formulaires) nécessitent JavaScript. Aucun formulaire n’est envoyé sans JavaScript.<nav aria-label="Navigation sans JavaScript"><a href="index.html">Accueil</a><a href="conseils.html">Conseils</a><a href="a-propos.html">Mission</a><a href="sources.html">Sources</a><a href="confidentialite.html">Confidentialité</a></nav></div></noscript>
<main id="main">
{body}
</main>
{footer()}
<dialog class="modal" id="install-dialog" aria-labelledby="install-title"><h2 id="install-title">Installer TchatzSafe</h2><p id="install-instructions"></p><p>Le mode hors connexion fonctionne pour les contenus que votre navigateur a pu mettre en cache.</p><div class="modal-actions"><button class="btn btn-secondary" type="button" data-close-install>Fermer</button></div></dialog>
</body></html>
'''
        (ROOT/filename).write_text(html)
        print('Généré :',filename)
    entries=[f'<url><loc>https://tchatzsafe.vercel.app/{"" if name=="index.html" else name}</loc></url>' for name in PAGES if name not in ['moderation.html','404.html','hors-ligne.html']]
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(entries)+'</urlset>')
    (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /moderation.html\nDisallow: /hors-ligne.html\nDisallow: /templates/\nDisallow: /tools/\nDisallow: /tests/\nSitemap: https://tchatzsafe.vercel.app/sitemap.xml\n')

if __name__=='__main__':build()
