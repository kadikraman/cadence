export type Visual = 'icon' | 'menu' | 'home-menu' | 'widget-picker';

export interface Step {
  title: string;
  body: string;
  visual: Visual;
}
