import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';

interface User {
  username: string;
  email: string;
}

interface FormValues {
  users: User[];
}

const Users: React.FC = () => {
  const { register, handleSubmit, control, watch, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        users: [{ username: '', email: '' }],
      },
    });

  const { fields, remove } = useFieldArray({
    control,
    name: 'users',
  });

  const [initialData, setInitialData] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const data = await response.json();
      const formattedData: User[] = data.map((user: any) => ({
        username: user.username,
        email: user.email,
      }));
      setInitialData(formattedData);
      reset({ users: formattedData });
    };

    fetchUsers();
  }, [reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const canSave = watch('users').some((user) => !user.username || !user.email);

  const addNewUser = () => {
    const newUser: User = { username: '', email: '' };
    setValue('users', [newUser, ...watch('users')]);
  };

  const addUserAfter = (index: number) => {
    const newUser: User = { username: '', email: '' };
    const users = watch('users');
    const updatedUsers = [
      ...users.slice(0, index + 1),
      newUser,
      ...users.slice(index + 1),
    ];
    setValue('users', updatedUsers);
  };

  return (
    <div>
      <h1>Users</h1>
      <button type="button" onClick={addNewUser}>
        Add New
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          <div key={item.id}>
            <input
              {...register(`users.${index}.username` as const)}
              placeholder="Username"
            />
            <input
              {...register(`users.${index}.email` as const)}
              placeholder="Email"
            />
            <button type="button" onClick={() => addUserAfter(index)}>
              Add after
            </button>
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
          </div>
        ))}

        <button type="submit" disabled={canSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Users;
