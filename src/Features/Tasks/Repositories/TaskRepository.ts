import AxiosHelper, { type AxiosConfig } from "../../../Services/AxiosHelper";
import type { ResponseModel } from "../../../Shared/Models/GlobalModels";
import { PrefixTask } from "../../../Shared/urls";
import type { TaskCreacionModel, TaskViewModel } from "../Models/TaskModels";

export const TaskRepository = () => {

  const getAll = async (): Promise<ResponseModel<TaskViewModel[]>> => {
    const config: AxiosConfig = {
      method: 'GET',
      url: `${PrefixTask}/GetAll`,
    };
    return await AxiosHelper.fetch<ResponseModel<TaskViewModel[]>>(config);
  };

  const getById = async (idTask: Number): Promise<ResponseModel<TaskViewModel>> => {
    const config: AxiosConfig = {
      method: 'GET',
      url: `${PrefixTask}/GetById/${idTask}`,
    };
    return await AxiosHelper.fetch<ResponseModel<TaskViewModel>>(config);
  };

  const create = async (data: TaskCreacionModel): Promise<ResponseModel<boolean>> => {
    const config: AxiosConfig = {
      method: 'POST',
      url: `${PrefixTask}/Create`,
      data: data
    };
    return await AxiosHelper.fetch<ResponseModel<boolean>>(config);
  };

  const update = async (data: TaskViewModel): Promise<ResponseModel<boolean>> => {
    const config: AxiosConfig = {
      method: 'PUT',
      url: `${PrefixTask}/Update`,
      data: data
    };
    return await AxiosHelper.fetch<ResponseModel<boolean>>(config);
  };

  const deleteTask = async (idTask: Number): Promise<ResponseModel<boolean>> => {
    const config: AxiosConfig = {
      method: 'DELETE',
      url: `${PrefixTask}/Delete/${idTask}`,
    };
    return await AxiosHelper.fetch<ResponseModel<boolean>>(config);
  };

  return {
    getAll,
    getById,
    create,
    update,
    deleteTask
  };
};
