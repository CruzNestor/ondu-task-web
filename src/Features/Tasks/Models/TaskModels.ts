
export interface TaskCreacionModel {
  title: string,
  description: string,
  status: string,
}

export interface TaskViewModel extends TaskCreacionModel {
  idTask: number,
}

export interface TaskStatusModel {
  estado: string,
}