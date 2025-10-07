import { ButtonIcon } from "../enum/button-icon/button-icon";
import { ButtonText } from "../enum/button-text/button-text";

export interface Tab {
  name: string;
  icon: ButtonIcon;
  label: ButtonText;
  route: string;
  currentIconPath: string;
}