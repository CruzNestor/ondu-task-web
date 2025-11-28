import { Button, CircularProgress } from "@mui/material";

type Props = {
  onClick: () => Promise<void>;
  isLoading: boolean;
  text?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  isDisabled?: boolean;
}

export const LoadingButton: React.FC<Props> = (props: Props) => {
  const {
    onClick,
    isLoading,
    width,
    height,
    text = "Aceptar",
    isDisabled = false,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <Button
      onClick={() => isLoading ? null : handleClick()}
      variant="contained"
      color="primary"
      disabled={isDisabled}
      sx={{
        width: width ?? 'auto',
        height: height ?? 'auto'
      }}
    >
      {/* Texto invisible para preservar tamaño */}
      <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {text}
      </span>

      {isLoading && (
        <CircularProgress
          size={20}
          sx={{
            color: 'white !important',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-10px',
            marginLeft: '-10px',
          }}
        />
      )}
    </Button>
  );
}