const contWidth = 100;
const contHeight = 100;
const contWidthRotated = contWidth * 2 ** 0.5;
const contHeightRotated = 0;
const rayWidth = 7;
const rayHeight = 2;
const rayWidth2 = rayHeight;
const rayHeight2 = rayWidth;
const separation = 30;
const disp = 14;
const dispRotated = disp * 2 ** 0.5;

const raysConfig = [
  {
    width: rayWidth,
    height: rayHeight,
    initialX: contWidth / 2 - separation / 2 - rayWidth + disp,
    initialY: contHeight / 2 - rayHeight / 2 - disp,
    rotated: false,
  },
  {
    width: rayWidth,
    height: rayHeight,
    initialX: contWidth / 2 + separation / 2 + disp,
    initialY: contHeight / 2 - rayHeight / 2 - disp,
    rotated: false,
  },
  {
    width: rayWidth2,
    height: rayHeight2,
    initialX: contWidth / 2 - rayWidth2 / 2 + disp,
    initialY: contHeight / 2 - separation / 2 - rayHeight2 - disp,
    rotated: false,
  },
  {
    width: rayWidth2,
    height: rayHeight2,
    initialX: contWidth / 2 - rayWidth2 / 2 + disp,
    initialY: contHeight / 2 + separation / 2 - disp,
    rotated: false,
  },
  {
    width: rayWidth,
    height: rayHeight,
    initialX: contWidthRotated / 2 - separation / 2 - rayWidth,
    initialY: contHeightRotated / 2 - rayHeight / 2 - dispRotated,
    rotated: true,
  },
  {
    width: rayWidth,
    height: rayHeight,
    initialX: contWidthRotated / 2 + separation / 2,
    initialY: contHeightRotated / 2 - rayHeight / 2 - dispRotated,
    rotated: true,
  },
  {
    width: rayWidth2,
    height: rayHeight2,
    initialX: contWidthRotated / 2 - rayWidth2 / 2,
    initialY: contHeightRotated / 2 - separation / 2 - rayHeight2 - dispRotated,
    rotated: true,
  },
  {
    width: rayWidth2,
    height: rayHeight2,
    initialX: contWidthRotated / 2 - rayWidth2 / 2,
    initialY: contHeightRotated / 2 + separation / 2 - dispRotated,
    rotated: true,
  },
];

export { raysConfig, disp, dispRotated };
