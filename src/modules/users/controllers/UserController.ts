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
      const payload = req.body as CreateUserDTO;
      const createdUser = await this.createUser.execute(payload);

      return res.status(201).json(createdUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(400).json({ message });
    }
  };

  get = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await this.getUser.execute(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const users = await this.listUsers.execute();
    return res.status(200).json(users);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    try {
      const payload = req.body as UpdateUserDTO;
      const updatedUser = await this.updateUser.execute(id, payload);

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(400).json({ message });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const deleted = await this.deleteUser.execute(id);

    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(204).send();
  };
}