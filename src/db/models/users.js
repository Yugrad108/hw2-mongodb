import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Метод toJSON для сокрытия пароля
usersSchema.methods.toJSON = function () {
  const userObject = this.toObject(); // Преобразует Mongoose-документ в обычный JS-объект
  delete userObject.password; // Удаляет поле password из объекта
  return userObject; // Возвращает изменённый объект
};

export const UsersCollection = model('users', usersSchema);
