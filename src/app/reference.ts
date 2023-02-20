export interface GenomeReferences {
  featureName: string,
  featureAddedDate: string,
  featureDescription?: string

}


export interface Reference{
  assembly_version: string;
  biological_sample_name: string;
  english_name: string;
  file_path: {
    cds: string | null;
    genome: string | null;
    gff: string | null;
    'hayai-annotation': string | null;
  };
  file_size:{
    cds: string | null;
    genome: string | null;
    gff: string | null;
    'hayai-annotation': string | null;
  };
  genome_assembly_id?: string | null;
  japanese_name: string;
  species_id: string;
  species_name: string;
  sub_name: string | null;
  sub_rank: string | null;
  refid?: number;
  refName: string;
  refCode: string;
  refDescription: string;
}

export interface ReferenceData{
  assembly_version: string;
  biological_sample_name: string;
  english_name: string;
  genome_file_path: string;
  genome_file_size: number;
  genome_assembly_id?: string | null;
  japanese_name: string;
  species_id: string;
  species_name: string;
  sub_name: string | null;
  sub_rank: string | null;
  refid?: number;
  refName: string;
  refCode: string;
  refDescription: string;
}

