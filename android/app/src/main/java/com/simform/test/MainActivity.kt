package com.simform.test

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String {
        return "test"
    }

   /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [DefaultReactActivityDelegate]
     * which allows you to easily enable Fabric and Concurrent React (aka React 18) with two boolean flags.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            // DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
            // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
            // DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        )
    }
}

