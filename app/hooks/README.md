# usePermission hook

The usePermissions hook is a custom React hook for managing permissions in applications. It provides functionalities for checking, requesting, and managing permissions, including single and multiple permissions, as well as notification permissions.

## Permissions hooks

We are having custom hooks for handling permissions lifecycle.

By default no permission handler is linked so make sure to link that first, Refer [react-native-permissions guide](https://github.com/zoontek/react-native-permissions#ios)

### useSinglePermissions hooks

  This hook takes a single permission and manages its lifecycle.

  Arguments:
  1. **type:** Define single permission to ask.
  1. **requestInitial:** To display alert before asking for permissions requests.
  1. **requestRationale:** To display alert when requesting permissions is partial denied.
  1. **requestBlocked:** To display alert when requesting permissions is permanently denied.
  1. **options:**
     1. **ask:** Ask the permissions when mounted, defaults to `false`</Br>
     1. **get:** Fetch information about the permissions when mounted, defaults to `true`</Br>
     1. **getWithCallback:** Fetch information about the permissions when mounted and trigger onGranted callback , defaults to `false`</Br>
  1. **onGranted:** Trigger when the permissions are granted.</Br>
  1. **customDialogComplete:** Trigger when the permissions custom dialog is complete.

  Returns:
  1. **status:** The status of the permission. like 'unavailable' | 'denied' | 'limited' | 'granted' | 'blocked'
  1. **Error:** Troubleshoot error while asking permission.
  1. **askPermission:** Callback function to trigger ask permission.
  1. **getPermission:** Callback function to trigger get current permission status.

```ts
const [data, error, askPermission, getPermission] = useSinglePermissions(
    Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    }),
    {},
    {
      title: '<AppName> wants to use your camera',
      message: '<AppName>’s won’t make sense without your profile picture. To add your profile picture, allow <AppName> to access your camera.',
      buttonPositive: 'Ok',
      buttonNegative: 'Cancel'
    },
    {
      title: 'We can’t add a photo.',
      message: '<AppName> can’t see you take a picture. To fix this, allow <AppName> to access your camera.',
      buttonPositive: 'Setting',
      buttonNegative: 'Cancel'
    }, {
      ask: false,
      get: true,
      getWithCallback: false
    }, () => {
      // Permission grant then what to do.
    }, () => {
      // dismiss the dialog
    }
  );
```
### useMultiplePermissions hooks

  This hook takes a multiple permissions and manages its lifecycle.

  Arguments:
  1. **types:** Define multiple permission to ask.
  1. **requestInitial:** To display alert before asking for permissions requests.
  1. **requestRationale:** To display alert when requesting permissions are partial denied.
  1. **requestBlocked:** To display alert when requesting permissions are permanently denied.
  1. **options:**
      1. **ask:** Ask the permissions when mounted, defaults to `false`
      1. **get:** Fetch information about the permissions when mounted, defaults to `true`
      1. **getWithCallback:** Fetch information about the permissions when mounted and trigger onGranted callback , defaults to `false`

  1. **onGranted:** Trigger when the permissions are granted.
  1. **customDialogComplete:** Trigger when the permissions custom dialog is complete.
  1. **optionTypes:** Use to make any permission as an optional behaviour

  Returns:
  1. **status:** The status of the permission. like 'unavailable' | 'denied' | 'limited' | 'granted' | 'blocked'
  1. **Error:** Troubleshoot error while asking permission.
  1. **askPermission:** Callback function to trigger ask permission.
  1. **getPermission:** Callback function to trigger get current permission status.

```ts
const [data, error, askPermission, getPermission] = useMultiplePermissions(
    Platform.select({
      ios: [PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
      android: [PERMISSIONS.ANDROID.WRITE_STORAGE, PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.MICROPHONE],
    }),
    {},
    {
      title: '<AppName> wants to use your camera',
      message: '<AppName>’s won’t make sense without your profile picture. To add your profile picture, allow <AppName> to access your camera.',
      buttonPositive: 'Ok',
      buttonNegative: 'Cancel'
    },
    {
      title: 'We can’t add a photo.',
      message: '<AppName> can’t see you take a picture. To fix this, allow <AppName> to access your camera.',
      buttonPositive: 'Setting',
      buttonNegative: 'Cancel'
    }, {
      ask: false,
      get: true,
      getWithCallback: false
    }, () => {
      // Permission grant then what to do.
    }, () => {
      // dismiss the dialog
    },
    Platform.select({
      ios: [PERMISSIONS.IOS.CAMERA],
      android: [PERMISSIONS.ANDROID.CAMERA],
    })
  );
```
## Notes

_This README provides an overview of the available hooks, their usage, parameters, and return values, making it easier for developers to understand and utilize the hook. For more details, please refer to the source code of the hook._