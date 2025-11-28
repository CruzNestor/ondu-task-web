import Swal, { type SweetAlertResult } from "sweetalert2";
import './style.css'; 

interface Props {
  onConfirm?: () => void,
  toast?: boolean,
  position?: "top" | "top-start" | "top-end" | "center" | "center-start" | "center-end" | "bottom" | "bottom-start" | "bottom-end",
  title: string,
  icon: "info" | "success" | "warning" | "error" | "question",
  html: string,
  showCancelButton?: boolean | undefined,
  confirmButtonText?: string | undefined,
  cancelButtonText?: string | null,
  dismiss?: boolean | undefined,
  time?: number,
}

function MyAlert(props: Props): Promise<SweetAlertResult<any>> {
  return new Promise((resolve) => {
    const {
      toast = false,
      position = 'center',
      title,
      icon,
      html,
      showCancelButton = false,
      confirmButtonText = 'Aceptar',
      cancelButtonText = 'Cancelar',
      dismiss = true,
      time = 1800
    } = props;

    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: "custom-swal-btn confirm",
        cancelButton: "custom-swal-btn cancel",
      },
      buttonsStyling: true,
    });

    newSwal.fire({
      title: `<strong>${title}</strong>`,
      toast: toast,
      position: position,
      icon: icon,
      html: html.replace(/\n/g, "<br>"),
      focusConfirm: false,
      showCancelButton: showCancelButton,
      showConfirmButton: !toast,
      timer: toast ? time : undefined,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText?.toUpperCase(),
      allowOutsideClick: dismiss
    }).then((result) => {
      resolve(result);
    });
  });
}

export const showAlertAsync = async (props: Props): Promise<void> => {
  const { onConfirm } = props;
  try {
    const result = await MyAlert(props);
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  } catch (error) {
    console.error("Error al mostrar el alerta:", error);
  }
}
