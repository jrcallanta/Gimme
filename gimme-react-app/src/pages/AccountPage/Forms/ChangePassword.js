import VerifyInputForm from '../../../components/FormInputs/VerifyInputForm';

import classes from './Form.module.scss';

function ChangePasswordForm(props) {

  const handleChangePassword = async (currentPass, newPass) => {
    const result = await props.onMakeChange('password', [currentPass, newPass])
    return result;
  }

  return (
    <div className={classes.Form}>
      <h1 className={classes.header}>Change Password</h1>

      <div className={classes.forms}>

        <VerifyInputForm
          label1={'Current Password'}
          label1ToolTip={`Enter your current password`}
          label2={'New Password'}
          label2ToolTip={`Password cannot start or end with spaces and must be at least 8 characters long`}
          label3={'Confirm New Password'}
          onSubmitWithErrorCheck={handleChangePassword}
        />

      </div>
    </div>
  );
}

export default ChangePasswordForm;
