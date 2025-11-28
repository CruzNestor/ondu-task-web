import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
}

const inputStyle = css`
  height: 38px;
  border-radius: 8px;
  padding: 5px 8px;
  border: 1px solid #ddd; /* Color del borde por defecto */
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #aaa; /* Color del borde cuando el input tiene el foco */
    outline: none; /* Elimina el borde de enfoque predeterminado del navegador */
  }
`;

const StyledInput = styled.input`${inputStyle}`;

export const InputSearch: React.FC<Props> = ({
  onChange,
  value,
  placeholder
}) => {
  return (
    <StyledInput
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}
