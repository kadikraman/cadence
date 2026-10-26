export type Visual = 'icon' | 'menu' | 'home-menu' | 'widget-picker' | 'sync';

export interface Step {
  title: string;
  body: string;
  visual: Visual;
}
