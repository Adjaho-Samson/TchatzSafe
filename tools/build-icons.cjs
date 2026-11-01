// Sprite local Font Awesome Free. Les noms historiques restent stables dans les templates.
// Les icônes SVG sont sous licence CC BY 4.0 : voir assets/FONT-AWESOME-LICENSE.txt.
const fs = require('node:fs');
const path = require('node:path');
const fa = require('@fortawesome/free-solid-svg-icons');
const icons = {
  shield: 'faShieldHalved',
  arrow: 'faArrowRight',
  external: 'faArrowUpRightFromSquare',
  lock: 'faLock',
  link: 'faLink',
  message: 'faMessage',
  phone: 'faMobileScreenButton',
  wallet: 'faWallet',
  briefcase: 'faBriefcase',
  chart: 'faChartLine',
  user: 'faUser',
  check: 'faCheck',
  chevron: 'faChevronRight',
  book: 'faBookOpen',
  globe: 'faGlobe',
  flag: 'faFlag',
  scan: 'faMagnifyingGlass',
  menu: 'faBars',
  close: 'faXmark',
  moon: 'faMoon',
  sun: 'faSun',
  search: 'faMagnifyingGlass',
  clock: 'faClock',
  help: 'faCircleQuestion',
  upload: 'faUpload',
  download: 'faDownload',
  trash: 'faTrashCan',
  eye: 'faEye',
  badge: 'faAward',
  info: 'faCircleInfo',
  alert: 'faTriangleExclamation',
  file: 'faFileLines',
  refresh: 'faArrowsRotate',
  signal: 'faSignal',
  fingerprint: 'faFingerprint',
  install: 'faDownload',
  share: 'faArrowUpFromBracket',
  offline: 'faWifi',
  education: 'faGraduationCap',
  play: 'faCirclePlay',
  circlecheck: 'faCircleCheck',
  device: 'faLaptop',
};
const symbols = Object.entries(icons).map(([name, exportName]) => {
  const definition = fa[exportName];
  if (!definition) throw new Error(`Icône Font Awesome inconnue : ${exportName}`);
  const [width, height, , , paths] = definition.icon;
  return `<symbol id="${name}" viewBox="0 0 ${width} ${height}">${[]
    .concat(paths)
    .map((d) => `<path d="${d}"/>`)
    .join('')}</symbol>`;
});
const root = path.resolve(__dirname, '..');
fs.writeFileSync(
  path.join(root, 'assets/icons.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`
);
console.log(`Sprite Font Awesome généré : ${symbols.length} icônes`);
