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
  @IBOutlet weak var contentView: NSVisualEffectView!
  @IBOutlet weak var webview: WebView!
  
  override func awakeFromNib() {
	  self.window.titleVisibility = NSWindowTitleVisibility.Hidden;
  	self.window.appearance = NSAppearance(named: NSAppearanceNameVibrantDark);
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) { 
    NSUserDefaults.standardUserDefaults().setBool(true, forKey:"WebKitDeveloperExtras");
    NSUserDefaults.standardUserDefaults().synchronize();
    
    self.window.contentView = initWebView(self.webview);
  }

  func applicationWillTerminate(aNotification: NSNotification) {
    // Insert code here to tear down your application
  }


}

