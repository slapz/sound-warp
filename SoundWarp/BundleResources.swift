//
//  BundleResources.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation

let MAIN_BUNDLE = NSBundle.mainBundle();
let DEFAULT_ENCODING = NSUTF8StringEncoding;

func getResourcePath(name: String, type: String) -> String
{
  return MAIN_BUNDLE.pathForResource(name, ofType: type)!;
}

func getResourcePath(dirname: String, name: String, type: String) -> String
{
  return MAIN_BUNDLE.pathForResource(name, ofType: type, inDirectory: dirname)!;
}

func readHTMLToString(path: String, encoding: UInt) -> NSString
{
  var str: NSString! = nil;
  
  do {
    str = try NSString(contentsOfFile: path, encoding: encoding);
  } catch {}
  
  return str;
}