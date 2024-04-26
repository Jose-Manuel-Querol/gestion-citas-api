import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
export class WhatsappTemplateDto {
  @IsNotEmpty()
  @IsString()
  codigoBot: string;

  @IsNotEmpty()
  @IsString()
  codigoPlantilla: string;

  @IsNotEmpty()
  @IsString()
  codigoPostalTel: string;

  @IsNotEmpty()
  @IsString()
  numeroReceptor: string;

  @IsNotEmpty()
  @IsString()
  nombreReceptor: string;

  @IsNotEmpty()
  @IsBoolean()
  fBotEncendido: boolean;

  @IsNotEmpty()
  @IsBoolean()
  fMostrarMensajeEnChat: boolean;

  @IsOptional()
  @IsString()
  urlArchivo?: string;

  @IsOptional()
  @IsString()
  extensionTipoArchivo?: string;

  @IsOptional()
  @IsString()
  tituloArchivo?: string;

  @IsOptional()
  @IsString()
  referencia1?: string;

  @IsOptional()
  @IsString()
  referencia2?: string;

  @IsOptional()
  @IsString()
  referencia3?: string;

  @IsNotEmpty()
  parametros: any;
}
