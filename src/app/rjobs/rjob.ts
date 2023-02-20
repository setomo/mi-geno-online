export interface Rjob {
  id?: number;
  uuid?: string;
  hostId?: string;
  uid?: string;
  fileGroupId?: string;
  jsonData?: string;
  createdDate?: string;
  completionDate?: string;
  state?: number;
  errorMessage?: string;
  succeeded?: boolean;
  completed?: boolean;
}

