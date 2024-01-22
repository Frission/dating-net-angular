import { environment } from "../../../environments/environment";

export abstract class BaseService {
    protected readonly baseUrl: string = environment.apiUrl
}