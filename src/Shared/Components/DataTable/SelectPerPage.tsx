import React from 'react';
import Select from 'react-select';

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: '120px', // Ajusta el ancho del contenedor
  }),
  control: (provided: any) => ({
    ...provided,
    border: '1px solid #ddd', // Estilo del borde
    boxShadow: 'none', // Elimina la sombra del borde
    borderRadius: '8px',
    height: '35px',
    fontSize: '14px',
    '&:hover': {
      border: '1px solid #aaa', // Estilo del borde al pasar el mouse
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '0px', // Radio del borde del menú
    zIndex: 100
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
    fontSize: '14px'
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#D1E5FC' : '#fff', // Estilo del fondo de las opciones
    color: state.isSelected ? '#000' : '#333', // Color del texto de las opciones
    '&:hover': {
      backgroundColor: state.isSelected ? '#D1E5FC' : '#f0f0f0', // Fondo al pasar el mouse sobre la opción
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#333', // Color del valor seleccionado
  }),
};

interface Props {
  onChange: (selected: any) => void;
  defaultValue: { value: number; label: string; }
  options: { value: number; label: string; }[]
}

export const SelectPerPage: React.FC<Props> = ({
  onChange,
  defaultValue,
  options
}) => {
  return (
    <Select
      onChange={onChange}
      defaultValue={defaultValue}
      options={options}
      styles={customStyles}
    />
  );
};