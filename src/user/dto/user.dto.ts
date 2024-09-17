import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(3, {
    message(validationArguments) {
      return `Name ${validationArguments.value} must be at least ${validationArguments.constraints[0]} characters long`;
    },
  })
  name?: string | null;

  @IsNumber(
    {},
    {
      message: 'Age must be a valid number',
    },
  )
  @Max(100)
  @Min(10, {
    message: 'Age must be at least 10',
  })
  @IsOptional()
  age?: number | null;
}
