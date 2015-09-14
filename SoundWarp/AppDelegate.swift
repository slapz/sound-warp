//
//  AppDelegate.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 22/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import AppKit
import WebKit
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

  @IBOutlet var window: NSWindow!
  @IBOutlet var contentView: NSView!
  @IBOutlet var webview: WebView!
  
  var jsBridge: JSBridge!
  var jsBridgeExports: JSBridgeExports!
  
  override func awakeFromNib() {
	  self.window.titleVisibility = NSWindowTitleVisibility.Visible;
    self.window.appearance = NSAppearance(named: NSAppearanceNameVibrantDark);
    self.window.movableByWindowBackground = true;
    
    self.window.titlebarAppearsTransparent = false;
    self.window.styleMask |= NSFullSizeContentViewWindowMask;
    
    self.window.makeKeyAndOrderFront(self.window);
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    initApp(self);
  }

  func applicationWillTerminate(aNotification: NSNotification) {
    // Insert code here to tear down your application
  }
  
  func callJSBridgeEvent(eventName: String)
  {
    do {
      if (self.jsBridge != nil && self.jsBridgeExports != nil) {
        try self.jsBridgeExports.emit(eventName);
      }
    } catch JSBridgeError.NoEventHandler {
      debugPrint("JSBridge: No event handler for '" + eventName + "' event!");
    } catch {
      debugPrint("JSBridge: error occured!");
    }
  }

  func callJSBridgeEvent(eventName: String, data: NSDictionary)
  {
    do {
      if (self.jsBridge != nil && self.jsBridgeExports != nil) {
	      try self.jsBridgeExports.emit(eventName, data: data);
      }
    } catch JSBridgeError.NoEventHandler {
      debugPrint("JSBridge: No event handler for '" + eventName + "' event!");
    } catch {
      debugPrint("JSBridge: error occured!");
    }
  }

}