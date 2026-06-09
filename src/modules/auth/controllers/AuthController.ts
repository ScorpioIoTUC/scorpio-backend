import { Request, Response } from 'express';
import { SignUpDTO } from '../dto/SignUpDTO';
import { SignUpResponseDTO } from '../dto/SignUpResponseDTO';
import { userRepository, UserRepository } from '../../users/repositories/UserRepository';
import { UserController } from '../../users/controllers/UserController';
import { SignUp } from '../use-cases/SignUp';

export class AuthController {
  private readonly signUp: SignUp;
  constructor(userRepository: UserRepository) {
    this.signUp = new SignUp(userRepository);
  }

  public static build(userRepository: UserRepository): AuthController {
    return new AuthController(userRepository);
  };

  signup = async (req: Request, res: Response): Promise<Response> => {
    try {
      const body = req.body;
      if (
        typeof body?.name !== 'string' ||
        typeof body?.email !== 'string' ||
        typeof body?.password !== 'string'
      ) {
        return res.status(400).json({
          message: 'Invalid request body',
        });
      }
      const result = await this.signUp.execute({
        name: body.name,
        email: body.email,
        password: body.password,
      });
      if (!result) {
        console.error('[Users][SIGNUP] Failed to sign up', result);
        return res.status(409).json(result)
      }
      return res.status(200).json(result)
    } catch (error) {
      console.error('[Users][SIGNUP] Failed to create user', error);
      const message =
        error instanceof Error
          ? `Unexpected error: ${error.message}`
          : 'Unexpected error. check the logs for more details';
      return res.status(400).json({ message });
    }
  }
}
