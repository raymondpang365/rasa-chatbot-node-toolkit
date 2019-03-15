const encrypt = () => {

};

const smsBuild = (type, ...args) => {
  const messages = {
    'status': `hi ${args.user.first_name}, your kit status has been updated to ${args.kit.status}`,

    'result': `hi ${args.user.first_name}, your kit result has been updated to ${args.kit.result}`
  };

  return encrypt(messages[type]);
};

export default smsBuild;
