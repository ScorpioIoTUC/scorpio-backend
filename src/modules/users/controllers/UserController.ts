import { Request, Response } from 'express';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUser } from '../use-cases/CreateUser';
import { DeleteUser } from '../use-cases/DeleteUser';
import { GetUser } from '../use-cases/GetUser';
import { ListUsers } from '../use-cases/ListUsers';
import { UpdateUser } from '../use-cases/UpdateUser';

export class UserController {
  private readonly createUser: CreateUser;
  private readonly getUser: GetUser;
  private readonly listUsers: ListUsers;
  private readonly updateUser: UpdateUser;
  private readonly deleteUser: DeleteUser;

  constructor(userRepository: UserRepository) {
    this.createUser = new CreateUser(userRepository);
    this.getUser = new GetUser(userRepository);
    this.listUsers = new ListUsers(userRepository);
    this.updateUser = new UpdateUser(userRepository);
    this.deleteUser = new DeleteUser(userRepository);
  }

  public static build(userRepository: UserRepository): UserController {
    return new UserController(userRepository);
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log('[Users][CREATE] Request received');
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
          message: 'Invalid request body.',
        });
      }
      const payload = req.body as CreateUserDTO;
      const createdUser = await this.createUser.execute(payload);

      console.log('[Users][CREATE] User created successfully', { id: createdUser.id });

      return res.status(201).json(createdUser);
    } catch (error) {
      console.error('[Users][CREATE] Failed to create user', error);
      const message =
        error instanceof Error
          ? `Unexpected error: ${error.message}`
          : 'Unexpected error. check the logs for more details';
      return res.status(400).json({ message });
    }
  };

  get = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    console.log('[Users][GET] Request received', { id: req.params.id });

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await this.getUser.execute(id);

    if (!user) {
      console.log('[Users][GET] User not found', { id });
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('[Users][GET] User found', { id });

    return res.status(200).json(user);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    console.log('[Users][LIST] Request received');
    const users = await this.listUsers.execute();

    console.log('[Users][LIST] Users returned', { count: users.length });
    return res.status(200).json(users);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    console.log('[Users][UPDATE] Request received', { id: req.params.id });

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    try {
      const payload = req.body as UpdateUserDTO;

      if (payload.type) {
        return res.status(400).json({ message: 'User type cannot be updated' });
      }

      const updatedUser = await this.updateUser.execute(id, payload);

      if (!updatedUser) {
        console.log('[Users][UPDATE] User not found', { id });
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('[Users][UPDATE] User updated successfully', { id });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('[Users][UPDATE] Failed to update user', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error. Provide the user attributes to update';
      return res.status(400).json({ message });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    console.log('[Users][DELETE] Request received', { id: req.params.id });

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const deleted = await this.deleteUser.execute(id);

    if (!deleted) {
      console.log('[Users][DELETE] User not found', { id });
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('[Users][DELETE] User deleted successfully', { id });

    return res.status(204).send();
  };
}