import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import DataTable from "../../../Shared/Components/DataTable";
import { useEffect, useState } from "react";
import type { AprobacionRechazoModel, TaskCreacionModel, TaskViewModel } from "../Models/TaskModels";
import { showAlertAsync } from "../../../Shared/Components/SweetAlert";
import { TaskRepository } from "../Repositories/TaskRepository";
import { useAppDispatch } from "../../../redux/Hooks";
import { logout } from "../../../redux/Slices/AuthSlice";

const TaskCreacionEmpty: TaskCreacionModel = {
  title: "",
  description: "",
  status: "",
}

const TaskPage: React.FC = () => {

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openModalAprobacion, setOpenModalAprobacion] = useState<boolean>(false);
  const [nuevaSolicitud, setNuevaSolicitud] = useState<TaskCreacionModel>(TaskCreacionEmpty);
  const [solicitudes, setSolicitudes] = useState<TaskViewModel[]>([]);
  const [aprobacionRechazo, setAprobacionRechazo] = useState<AprobacionRechazoModel>({
    comentario: "",
    estado: 0,
  });
  
  const [idSelected, setIdSelected] = useState<number>(0);

  const taskRepository = TaskRepository();
  const dispatch = useAppDispatch();

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    try {
      await getAll();
    } catch (error) {
      await showAlertAsync({
        title: 'Error',
        icon: 'error',
        html: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
        dismiss: false,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  const getAll = async () => {
    const response = await taskRepository.getAll();
    if (response.status === 'success') {
      setSolicitudes(response.data);
    }
  }

  const handleChange = (value: string, field: keyof TaskCreacionModel) => {
    setNuevaSolicitud(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {

      if (nuevaSolicitud.title === '') {
        alert("Ingrese una título");
        return;
      }

      const response = await taskRepository.create(nuevaSolicitud);
      if (response.status === 'success') {
        await showAlertAsync({
          title: 'Éxito',
          icon: 'success',
          html: response.message,
          confirmButtonText: 'Aceptar',
        });
      }

    } catch (error) {
      await showAlertAsync({
        title: 'Error',
        icon: 'error',
        html: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
        dismiss: false,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  const handleOpenModalAprobacion = (id: number) => {
    setIdSelected(id);
    setOpenModalAprobacion(true);
  }

  const handleLogout = async () => {
    dispatch(logout());
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setAprobacionRechazo(prev => ({
      ...prev,
      estado: Number(event.target.value ?? "0"),
    }));
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="center" sx={{ mt: '20px', mr: '30px' }}>
          <Box sx={{ width: '100%', textAlign: 'right' }}>
            <Button onClick={handleLogout}>Cerrar Sesión</Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" sx={{ mt: '60px' }}>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h4">Consultar Tareas</Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', mt: '60px' }}>

          <Box display="flex" justifyContent="end" sx={{ width: '100%' }}>
            <Box sx={{ mr: '45px', mb: '20px' }}>
              <Button onClick={() => setOpenDialog(true)} variant="contained"> Agregar Nueva Solicitud </Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center">

            <Card sx={{ width: '95%' }}>
              <DataTable
                columns={[
                  { header: 'Título', accessor: 'title' },
                  { header: 'Descripción', accessor: 'description' },
                  { header: 'Estado', accessor: 'estado' },
                  { header: '', accessor: 'action' },
                ]}
                rows={[...solicitudes.map((item) => ({
                  title: item.title,
                  description: item.description,
                  estado: item.status,
                  action: <Box>
                    <Button variant="outlined">Finalizar</Button>
                  </Box>
                }))]}
              />
            </Card>
          </Box>
        </Box>
      </Box>

      <Dialog open={openDialog} fullWidth onClose={() => setOpenDialog(false)} maxWidth='sm'>
        <DialogTitle>{'Crear Tarea'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <Box mb={2}>
              <TextField
                onChange={(e) => handleChange(e.target.value, 'title')}
                value={nuevaSolicitud.title}
                type="string"
                label="Title"
                size="small"
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                onChange={(e) => handleChange(e.target.value, 'description')}
                value={nuevaSolicitud.description}
                type="string"
                label="Descripcion"
                size="small"
                rows={4}
                fullWidth
                multiline
              />
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="outline">
            Cancelar
          </Button>
          <Button
            onClick={() => handleSave()}
            variant="contained"
            color="primary"
          >
            {"Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal aprobación y rechazo */}
      <Dialog open={openModalAprobacion} fullWidth onClose={() => setOpenModalAprobacion(false)} maxWidth='sm'>
        <DialogTitle>{'Solicitar Compra'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <Box mb={2}>
              <InputLabel id="select-label">Selecciona una opción</InputLabel>
              <Select
                labelId="select-label"
                id="mui-select"
                value={aprobacionRechazo.estado}
                label="Selecciona una opción"
                aria-placeholder="Seleccionar una opción"
                fullWidth
              >
                <MenuItem value="1">Aprobar</MenuItem>
                <MenuItem value="2">Rechazar</MenuItem>
              </Select>
            </Box>
            <Box mb={2}>
              <TextField
                onChange={(e) => handleChange(e.target.value, 'description')}
                value={nuevaSolicitud.description}
                type="string"
                label="Comentario"
                size="small"
                rows={4}
                fullWidth
                multiline
              />
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pb: 2 }}>
          <Button onClick={() => setOpenModalAprobacion(false)} variant="contained" color="outline">
            Cancelar
          </Button>
          <Button
            onClick={() => handleSave()}
            variant="contained"
            color="primary"
          >
            {"Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskPage;