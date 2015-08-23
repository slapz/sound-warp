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

  @IBOutlet weak var window: NSWindow!
  @IBOutlet weak var contentView: NSView!
  @IBOutlet weak var webview: WebView!
  
  @IBOutlet weak var historyNavigation: NSSegmentedControl!
  @IBOutlet weak var search: NSSearchFieldCell!
  
  var jsBridge: JSBridge!
  var jsBridgeExports: JSBridgeExports!
  
  override func awakeFromNib() {
	  self.window.titleVisibility = NSWindowTitleVisibility.Hidden;
  	self.window.appearance = NSAppearance(named: NSAppearanceNameVibrantDark);
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    initApp(self);
  }

  func applicationWillTerminate(aNotification: NSNotification) {
    // Insert code here to tear down your application
  }

  @IBAction func processHistoryNavigation(sender: AnyObject) {
    self.jsBridgeExports.emit("history-forward");
  }
}