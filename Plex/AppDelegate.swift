//
//  AppDelegate.swift
//  Plex
//
//  Created by Eric Yanush on 2015-10-14.
//  Copyright © 2015 EricYanush. All rights reserved.
//

import UIKit
import TVMLKit
import Swifter

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

    var window: UIWindow?

    var appController: TVApplicationController?
    static let PMSBaseURL = "http://10.0.1.100:32400"
    static let TVBootURL = "http://localhost:9999/app.js"
    static let TVAppBaseURL = "http://localhost:9999/"
    
    var server: HttpServer = HttpServer();

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool
    {
        //Start the http server for our resources
        server = HttpServer()
        let resourceString = NSBundle.mainBundle().pathForResource("app", ofType: "js", inDirectory: "plexAssets")!.stringByReplacingOccurrencesOfString("app.js", withString: "")
        server["/(.+)"] = HttpHandlers.directoryBrowser(resourceString)
        let error: NSErrorPointer = nil
        server.start(9999, error: error)
        window = UIWindow(frame: UIScreen.mainScreen().bounds)
        
        let appControllerContext = TVApplicationControllerContext()
        
        guard let javascriptUrl = NSURL(string: AppDelegate.TVBootURL) else {
            fatalError("Unable to create NSURL")
        }
        appControllerContext.javaScriptApplicationURL = javascriptUrl
        appControllerContext.launchOptions["BASEURL"] = AppDelegate.PMSBaseURL
        appControllerContext.launchOptions["TVAppBaseURL"] = AppDelegate.TVAppBaseURL
        
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}

