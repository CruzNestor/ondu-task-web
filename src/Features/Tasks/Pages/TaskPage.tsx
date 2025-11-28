import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, TextField, Typography } from "@mui/material";
import DataTable from "../../../Shared/Components/DataTable";
import { useEffect, useState } from "react";
import type { TaskCreacionModel, TaskViewModel } from "../Models/TaskModels";
import { showAlertAsync } from "../../../Shared/Components/SweetAlert";
import { TaskRepository } from "../Repositories/TaskRepository";
import { useAppDispatch } from "../../../redux/Hooks";
import { logout } from "../../../redux/Slices/AuthSlice";
import { EnumTaskEstado } from "../../../Shared/Enums/EnumTaskStatus";
import { LoadingButton } from "../../../Shared/Components/LoadingButton";

const TaskCreacionEmpty: TaskCreacionModel = {
  title: "",
  description: "",
  status: "",
}

const TaskEditEmpty: TaskViewModel = {
  idTask: 0,
  title: "",
  description: "",
  status: "",
}

const TaskPage: React.FC = () => {

  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openModelEdit, setOpenModalEdit] = useState<boolean>(false);
  const [nuevaSolicitud, setNuevaSolicitud] = useState<TaskCreacionModel>(TaskCreacionEmpty);
  const [updateSolicitud, setUpdateSolicitud] = useState<TaskViewModel>(TaskEditEmpty);
  const [solicitudes, setSolicitudes] = useState<TaskViewModel[]>([]);

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

  const getById = async (idTask: Number) => {
    try {
      const response = await taskRepository.getById(idTask);
      if (response.status === 'success') {
        setUpdateSolicitud(response.data);
        setOpenModalEdit(true);
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

  const handleSave = async () => {
    try {
      if (nuevaSolicitud.title === '') {
        alert("Ingrese una título");
        return;
      }
      setLoadingSave(true)
      const response = await taskRepository.create(nuevaSolicitud);
      if (response.status === 'success') {
        setOpenDialog(false)
        await showAlertAsync({
          title: 'Éxito',
          icon: 'success',
          html: response.message,
          confirmButtonText: 'Aceptar',
        });
        await getAll()
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
    setLoadingSave(false)
  }

  const handleUpdate = async () => {
    try {
      if (updateSolicitud.title === '') {
        alert("Ingrese una título");
        return;
      }
      setLoadingUpdate(true)
      const response = await taskRepository.update(updateSolicitud);
      if (response.status === 'success') {
        await showAlertAsync({
          title: 'Éxito',
          icon: 'success',
          html: "Actualizado correctamente",
          confirmButtonText: 'Aceptar',
        });
        setOpenModalEdit(false)
        await getAll()
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
    setLoadingUpdate(false)
  }

  const confirmDeleteRegister = async (idTask: Number) => {
    await showAlertAsync({
      title: 'Eliminar',
      icon: 'warning',
      html: "Está seguro que quiere eliminar esta tarea.",
      confirmButtonText: 'BORRAR',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      onConfirm: () => deleteRegister(idTask)
    });
  }

  const deleteRegister = async (idTask: Number) => {
    const response = await taskRepository.deleteTask(idTask);
    if (response.status === 'success') {
      await showAlertAsync({
        title: 'Eliminado',
        icon: 'success',
        html: "Eliminado correctamente",
        confirmButtonText: 'Aceptar',
      });
      await getAll();
    }
  }

  const handleLogout = async () => {
    dispatch(logout());
  }

  const handleChange = (value: string, field: keyof TaskCreacionModel) => {
    setNuevaSolicitud(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDataUpdateChange = (value: string, field: keyof TaskViewModel) => {
    setUpdateSolicitud(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdateSolicitud(prev => ({
      ...prev,
      status: event.target.value,
    }))
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
              <Button onClick={() => setOpenDialog(true)} variant="contained">Agregar Nueva Tarea</Button>
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
                  action: <Box display="flex" gap={2}>
                    <Button onClick={() => getById(item.idTask)} variant="outlined">Editar</Button>
                    <Button onClick={() => confirmDeleteRegister(item.idTask)} variant="outlined" color="error">Eliminar</Button>
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
          <LoadingButton
            isLoading={loadingSave}
            onClick={handleSave}
            text="Guardar"
          />
        </DialogActions>
      </Dialog>

      {/* Modal Actualizar */}
      <Dialog open={openModelEdit} fullWidth onClose={() => setOpenModalEdit(false)} maxWidth='sm'>
        <DialogTitle>{'Actualizar Tarea'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <Box mb={2}>
              <TextField
                select
                label="Selecciona una opción"
                value={updateSolicitud.status}
                size="small"
                fullWidth
                onChange={(e) => handleSelectChange(e)}
              >
                {Object.entries(EnumTaskEstado).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box mb={2}>
              <TextField
                onChange={(e) => handleDataUpdateChange(e.target.value, 'title')}
                value={updateSolicitud.title}
                type="string"
                label="Título"
                size="small"
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                onChange={(e) => handleDataUpdateChange(e.target.value, 'description')}
                value={updateSolicitud.description}
                type="string"
                label="Descripción"
                size="small"
                rows={4}
                fullWidth
                multiline
              />
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pb: 2 }}>
          <Button onClick={() => setOpenModalEdit(false)} variant="contained" color="outline">
            Cancelar
          </Button>
          <LoadingButton
            isLoading={loadingUpdate}
            onClick={handleUpdate}
            text="Actualizar"
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskPage;