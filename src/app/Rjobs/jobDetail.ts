export class JobDetail {
  outFolder: string;
  Kcv: number;
  Cyclescv: number;
  GBLUP_RR: boolean;
  Bayesian_Lasso: boolean;
  Random_Forest: boolean;
  nIter: number;
  burnIn: number;
  ntree: number;
  randomSeedNumber: number;

  constructor() {
    this.outFolder = "result-5e33977a753094.15394991";
    this.Kcv = 2;
    this.Cyclescv = 20;
    this.GBLUP_RR = true;
    this.Bayesian_Lasso = false;
    this.Random_Forest = false;
    this.nIter = 15000;
    this.burnIn = 5000;
    this.ntree = 500;
    this.randomSeedNumber = 1;

  }

}
