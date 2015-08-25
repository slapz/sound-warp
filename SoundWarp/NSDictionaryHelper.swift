//
//  NSDictionaryHelper.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 8/24/15.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

func convertDictToJSON(dict: NSDictionary) -> String
{
  var stringValue: String = "";
  var _value: String;
  var i: Int = 0;
  let total: Int = dict.count;
  if (total > 0) {
    stringValue = "{";
    for (key, value) in dict {
      _value = value as! String;
      if value is NSDictionary {
        _value = convertDictToJSON(value as! NSDictionary);
      }
      stringValue += "\"" + (key as! String) + "\": \"" + _value + "\"";
      if (i < (total - 1)) {
        stringValue += ",";
      }
      i++;
    }
    stringValue += "}";
  } else {
    stringValue = "{}";
  }
  
  return stringValue;
}

func convertJSONToDict(json: NSData) -> NSDictionary
{
  var dict: NSDictionary = NSDictionary();
  do {
    dict = try NSJSONSerialization.JSONObjectWithData(json, options: NSJSONReadingOptions.MutableContainers) as! NSDictionary;
  } catch let error as NSError {
    print(error.localizedDescription);
  }
  return dict;
}

func convertJSONToDict(json: String) -> NSDictionary
{
  let jsonData = (json as NSString).dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false);
  return convertJSONToDict(jsonData!);
}

func convertJSONToDict(json: WebScriptObject) -> NSDictionary
{
  return json.JSValue().toObject() as! NSDictionary;
}