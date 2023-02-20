export interface Rjob {
  id: number;
  uid: string;
  hostId: string;
  uuid: string;
  fileGroupId: string;
  jsonData: string;
  createdDate: string;
  completedDate: string;
  state: number;
  errorMessage: string;
  succeeded: boolean;
  completed: boolean;
}

