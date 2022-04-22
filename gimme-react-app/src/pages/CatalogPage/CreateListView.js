import { useState } from 'react';

import LoaderIcon from '../../components/LoaderIcon';
import InputTitle from '../../components/InputTitle';

import classes from './CreateListView.module.scss';

function CreateListView(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [hint, setHint] = useState(null);

  const createList = async (listName) => {
    setIsLoading(true)

    setHint(null)
    const result = await props.onCreateList(listName);

    if(result.error) {
      setHint(result.message)
      setIsLoading(false)
    }

    else {
      // should've been redirected
    }
  }

  return (
    <div className={classes.CreateListView}>
      <div>
        <InputTitle
          isActive={false}
          isEditing={true}
          isBlurable={false}
          allowEmpty={false}
          placeholder={'Enter New List Title'}
          hint={hint}
          onValidEnter={createList}
          showUnderline={true}
        />
      </div>

      {isLoading && <LoaderIcon />}
    </div>
  )
}

export default CreateListView;
