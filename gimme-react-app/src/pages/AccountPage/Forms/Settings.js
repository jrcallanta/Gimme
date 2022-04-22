import SingleInputForm from '../../../components/FormInputs/SingleInputForm';

import classes from './Form.module.scss';

function SettingsForm(props) {

  const handleChangeName = async (val) => {
    const result = await props.onMakeChange('name', val)
    return result;
  }

  const handleChangeHandle = async (val) => {
    const result = await props.onMakeChange('handle', val)
    return result;
  }

  // const handleChangeEmail = async (val) => {
  //   const result = await props.onMakeChange('email', val)
  //   return result
  // }

  return (
    <div className={classes.Form}>
      <h1 className={classes.header}>Account Settings</h1>

      <div className={classes.forms}>

        <SingleInputForm
          label={'Change Name'}
          tooltip={null}
          placeholder={props.user.name}
          onSubmitWithErrorCheck={handleChangeName}
        />

        <SingleInputForm
          label={'Request New Handle'}
          tooltip={`Usernames can only contain letters, numbers, spaces, and underscores`}
          prepend={'@'}
          placeholder={props.user.handle}
          onSubmitWithErrorCheck={handleChangeHandle}
        />

      </div>
    </div>
  )
};

export default SettingsForm;
