import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errors';
import { RegisterInput, LoginInput } from '../validations/auth';

export class AuthService {
  static async register(input: RegisterInput): Promise<{ token: string; user: Partial<IUser> }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: input.email }, { username: input.username }],
    });

    if (existingUser) {
      throw new AppError(409, 'User with this email or username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, 10);

    // Create user
    const user = await User.create({
      username: input.username,
      email: input.email,
      passwordHash,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    return { token, user: userResponse };
  }

  static async login(input: LoginInput): Promise<{ token: string; user: Partial<IUser> }> {
    // Find user by email
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    return { token, user: userResponse };
  }

  static async getUserById(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    return userResponse;
  }
}
