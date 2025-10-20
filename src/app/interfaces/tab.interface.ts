import { ButtonIcon } from "@/app/enum/button-icon/button-icon";
import { ButtonText } from "@/app/enum/button-text/button-text";

export interface Tab {
  name: string;
  icon: ButtonIcon;
  label: ButtonText;
  route: string;
  currentIconPath: string;
}