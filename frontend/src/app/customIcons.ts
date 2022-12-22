import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

export const initializeCustomIcons = (mir: MatIconRegistry, ds: DomSanitizer): void => {
  const addIcon = (fileName: string): MatIconRegistry =>
    mir.addSvgIcon(`cb2-${fileName}`, ds.bypassSecurityTrustResourceUrl(`/assets/icons/${fileName}.svg`));

  addIcon('arrow');
  addIcon('bug');
  addIcon('flask');
  addIcon('magnifier');
  addIcon('menu');
  addIcon('puzzle');
};
