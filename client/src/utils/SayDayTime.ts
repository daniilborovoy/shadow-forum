export default (name: string | null): string => {
  const currentDate = (new Date()).getHours();
  switch (true) {
    case (currentDate >= 5) && (currentDate < 11):
      return 'Доброе утро' + ` ${name || ''}`;
    case (currentDate >= 11) && (currentDate < 16):
      return 'Добрый день' + ` ${name || ''}`;
    case (currentDate >= 16) && (currentDate <= 23):
      return 'Добрый вечер' + ` ${name || ''}`;
    case (currentDate >= 0) && (currentDate < 5):
      return 'Доброй ночи' + ` ${name || ''}`;
    default:
      return 'Здравствуйте' + ` ${name}`;
  }
};
