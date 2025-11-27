import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class SignInResponseDto {
  @ApiProperty({ description: 'Authenticated user object', type: () => User })
  user: User;

  @ApiProperty({ description: 'JWT access token' })
  token: string;
}
