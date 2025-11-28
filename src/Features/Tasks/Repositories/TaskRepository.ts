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

  const create = async (data: TaskCreacionModel): Promise<ResponseModel<boolean>> => {
    const config: AxiosConfig = {
      method: 'POST',
      url: `${PrefixTask}/CreateTask`,
      data: data
    };
    return await AxiosHelper.fetch<ResponseModel<boolean>>(config);
  };

  return {
    getAll,
    create,
  };
};
