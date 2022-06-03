import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Container,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Badge,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { User } from '../../models/user.model';
import { userApi } from '../../services/user.service';
import setPageTitle from '../../utils/SetPageTitle';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import AvatarInput from '../../components/avatar-input/AvatarInput';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { useDropzone } from 'react-dropzone';
import SelectThemeButtons from '../../components/select-theme-buttons/SelectThemeButtons';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const Input = styled('input')({
  display: 'none',
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      width='100%'
      role='tabpanel'
      hidden={value !== index}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

const SettingsPage: FC<{ user: User }> = ({ user }) => {
  const [userName, setUserName] = useState<string>(user.name);
  const [userEmail, setUserEmail] = useState<string>(user.email);
  const [userAccountAddress, setUserAccountAddress] = useState<string>(user.id);
  const [uploadImageFile, setUploadImageFile] = useState<FormData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(user.avatar || '');
  const [isNewAvatar, setIsNewAvatar] = useState<boolean>(false);
  const activated = user.isActivated;
  const currentUserName = useRef(userName);
  const currentUserEmail = useRef(userEmail);
  const matches = useMediaQuery('(min-width:600px)');
  const [loading, setLoading] = useState<boolean>(false);
  const enqueueSnackbar = useEnqueueSnackbar();
  useEffect(() => {
    setPageTitle('Настройки аккаунта');
  }, []);

  const changeNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserName(event.target.value);
    }
  };

  const changeEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserEmail(event.target.value);
    }
  };

  const handleChangeAccountAddress = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserAccountAddress(event.target.value);
    }
  };

  const [uploadUserAvatar] = userApi.useUpdateUserAvatarMutation();

  const updateAccountHandler = (e: FormEvent) => {
    e.preventDefault();
    if (uploadImageFile) {
      setLoading(true);
      uploadUserAvatar(uploadImageFile)
        .unwrap()
        .then((res) => {
          setIsNewAvatar(false);
          enqueueSnackbar(res, {
            variant: 'success',
          });
          enqueueSnackbar('Изменения аватара будет доступно после перезагрузки страницы.', {
            variant: 'info',
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Ошибка при загрузке аватара: ${err.data.message}`, {
            variant: 'error',
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const cancelChangeAvatarHandler = () => {
    setImageUrl(user.avatar || '');
    setUploadImageFile(null);
    setIsNewAvatar(false);
  };

  const onDropUploadAvatar = useCallback(
    (acceptedFiles: File[]) => {
      const input = acceptedFiles[0];
      if (!input) return;
      setImageUrl(URL.createObjectURL(input));
      const data = new FormData();
      data.append('avatar', input);
      setUploadImageFile(data);
      setIsNewAvatar(true);
    },
    [uploadImageFile],
  );

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop: onDropUploadAvatar,
    accept: ['image/*'],
  });

  return (
    <Container>
      <Box
        display='flex'
        sx={{ padding: '81px 0' }}
        minHeight='100vh'
        justifyContent='flex-start'
        alignItems='flex-start'
        flexDirection={{ xs: 'column', sm: 'row' }}
      >
        <Tabs
          orientation={matches ? 'vertical' : 'horizontal'}
          variant='scrollable'
          value={value}
          textColor='secondary'
          indicatorColor='secondary'
          onChange={handleChange}
          sx={{
            borderRight: matches ? 1 : 0,
            borderBottom: matches ? 0 : 1,
            borderColor: 'divider',
            width: matches ? '250px' : '100%',
            marginRight: matches ? '15px' : '0',
            marginBottom: matches ? '0' : '15px',
          }}
        >
          <Tab
            sx={{
              borderRadius: matches ? '5px 0 0 5px' : '5px 5px 0 0',
              '&.Mui-selected': {
                color: '#1890ff',
              },
              fontWeight: 'bold',
            }}
            label='Информация об аккануте'
          />
          <Tab
            sx={{
              borderRadius: matches ? '5px 0 0 5px' : '5px 5px 0 0',
              '&.Mui-selected': {
                color: '#1890ff',
              },
              fontWeight: 'bold',
            }}
            label='Изменение темы'
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Box
            component='form'
            onSubmit={updateAccountHandler}
            method='PUT'
            encType='multipart/form-data'
          >
            <Box display='flex' flexDirection='column'>
              <Typography textAlign='center' mb={5} fontSize={30}>
                Информация об аккаунте
              </Typography>
              <Badge
                sx={{
                  width: '150px',
                  height: '150px',
                  marginBottom: { xs: '40px', sm: '15px' },
                  alignSelf: { xs: 'center', sm: 'flex-end' },
                }}
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  isNewAvatar && (
                    <IconButton onClick={cancelChangeAvatarHandler}>
                      <CloseIcon />
                    </IconButton>
                  )
                }
              >
                <InputLabel
                  {...getRootProps()}
                  htmlFor='user-avatar-input'
                  sx={{
                    width: 'inherit',
                    height: 'inherit',
                    borderRadius: '50%',
                  }}
                >
                  <AvatarInput
                    imageUrl={imageUrl}
                    userName={currentUserName.current}
                    isDragAccept={isDragAccept}
                  />
                </InputLabel>
              </Badge>
              <Input
                id='user-avatar-input'
                {...getInputProps()}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
                name='avatar'
                accept='image/*'
                type='file'
              />
              <Typography>Имя:</Typography>
              <TextField
                helperText='Ваше имя может отобразиться на ShadowForum, где вы участвуете или упоминаетесь. Вы можете изменить его в любое время.'
                placeholder={userName}
                value={userName}
                // onChange={changeNameHandler}
                sx={{ marginBottom: '15px' }}
              />
              <Typography>Email:</Typography>
              <TextField
                sx={{ marginBottom: '15px' }}
                fullWidth
                value={userEmail}
                // onChange={changeEmailHandler}
              />
              <Typography>Адрес аккаунта:</Typography>
              <TextField
                sx={{ marginBottom: '15px' }}
                helperText='Вы можете поменять адрес своей личной страницы на ShadowForum.'
                value={userAccountAddress}
                // onChange={handleChangeAccountAddress}
              />
              <FormGroup sx={{ marginBottom: '15px' }}>
                <FormControlLabel
                  checked={activated}
                  disabled={activated}
                  control={<Checkbox />}
                  label={activated ? 'Аккаунт подтверждён!' : 'Аккаунт не подтверждён!'}
                />
                <FormHelperText>
                  {user.isActivated
                    ? 'Аккаунт успешно подтверждён!'
                    : `Подтвердите аккаунт на почте: ${currentUserEmail.current}`}
                </FormHelperText>
              </FormGroup>
              <LoadingButton
                sx={{ fontWeight: 700 }}
                fullWidth
                startIcon={<SaveIcon />}
                variant='contained'
                type='submit'
                loading={loading}
                disabled={!uploadImageFile}
              >
                Обновить аккаунт
              </LoadingButton>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            display='flex'
            width='100%'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
            <Typography textAlign='center' mb={5} fontSize={30}>
              Выбор темы
            </Typography>
            <SelectThemeButtons />
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default SettingsPage;
