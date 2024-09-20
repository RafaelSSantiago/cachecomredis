import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entites/User";
import { setCache, getCache } from "../../infrastructure/cache/redis.cache";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(id: string, name: string, email: string): Promise<User> {
    const user = new User(id, name, email);
    const createdUser = await this.userRepository.create(user);

    // Cacheando o usuário recém-criado
    await setCache(`user:${user.id}`, JSON.stringify(createdUser), 3600);

    return createdUser;
  }

  async getUserById(id: string): Promise<User | null> {
    // Primeiro, tente pegar o usuário do cache
    const cachedUser = await getCache(`user:${id}`);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    // Se não estiver no cache, busque no repositório
    const user = await this.userRepository.findById(id);

    if (user) {
      // Armazena no cache para consultas futuras
      await setCache(`user:${id}`, JSON.stringify(user), 3600);
    }

    return user;
  }
}
