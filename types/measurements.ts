export enum MeasurementType {
  WEIGHT = 'weight',
  CALF_CIRCUMFERENCE = 'calfCircumference',
  THIGH_CIRCUMFERENCE = 'thighCircumference',
  BUTT_CIRCUMFERENCE = 'buttCircumference',
  HIPS_CIRCUMFERENCE = 'hipsCircumference',
  WAIST_CIRCUMFERENCE = 'waistCircumference',
  STOMACH_CIRCUMFERENCE = 'stomachCircumference',
  CHEST_CIRCUMFERENCE = 'chestCircumference',
  UPPER_ARM_CIRCUMFERENCE = 'upperArmCircumference',
  BODY_FAT_PERCENTAGE = 'bodyFatPercentage',
  BODY_FAT_MASS = 'bodyFatMass',
  LEAN_BODY_PERCENTAGE = 'leanBodyPercentage',
  LEAN_BODY_MASS = 'leanBodyMass',
  HYDRATION_PERCENTAGE = 'hydrationPercentage',
}

export type MeasurementInput = {
  [key in MeasurementType]?: number;
} & {
  date?: Date;
};

export type TimePeriod = '1w' | '1m' | '3m' | '6m' | '12m' | 'all';

export type AggregatedMeasurement = {
  date: string;
} & {
  [key in MeasurementType]?: number;
};
