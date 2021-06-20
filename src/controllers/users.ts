import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { BaseController } from '.';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      res.status(201).send(newUser);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ code: 401, error: 'User not found!' });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return res
        .status(401)
        .send({ code: 401, error: 'Password does not match!' });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ ...user.toJSON(), ...{ token } });
  }
}
