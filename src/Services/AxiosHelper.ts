import axios, { type AxiosRequestConfig, type ResponseType } from "axios";
import { axiosClient } from "./AxiosClient";

export interface AxiosConfig {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  params?: Record<string, any>,
  contentType?: string,
  responseType?: ResponseType,
}

export default class AxiosHelper {

  public static async fetch<ResponseT = any>(request: AxiosConfig): Promise<ResponseT> {
    try {
      const config: AxiosRequestConfig = {
        url: request.url,
        method: request.method,
        headers: this.buildHeaders(request.contentType),
        params: request.params,
        data: request.data,
        responseType: request.responseType,
      };
      const response = await axiosClient<ResponseT>(config);
      return response.data; // Retornar directamente los datos de la API
    } catch (error: any) {
      throw await this.handleError(error); // Manejo de errores limpio
    }
  }

  private static buildHeaders(contentType?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType ?? 'application/json',
    };

    const token = localStorage.getItem('OnduToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private static async handleError(error: any): Promise<Error> {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
  
      // Manejo especial para 401
      if (status === 401) {
        return new Error('No está autorizado para realizar esta acción');
      }
  
      let errorMessage: string;
  
      if (error.response.data instanceof Blob) {
        // Si es un Blob, convertimos a texto
        errorMessage = await error.response.data.text();
      } else {
        // En otros casos, usamos el mensaje de error o uno genérico
        errorMessage = error.response.data.message || 'Error desconocido';
      }
  
      try {
        const jsondata = JSON.parse(errorMessage);
        errorMessage = jsondata.message;
      } catch {
        // Si no es un JSON válido, usar el texto directamente
      }
  
      return new Error(errorMessage);
    }
  
    return new Error('Ocurrió un error inesperado');
  }

  static close = () => {
    localStorage.setItem("OnduToken", '');
    window.location.href = '/auth/signin';
  }

}
