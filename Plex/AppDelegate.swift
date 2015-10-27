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
import CocoaAsyncSocket


struct PMS {
    let address :String
    let port :String
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate, GCDAsyncUdpSocketDelegate {

    var window: UIWindow?

    var appController: TVApplicationController?
    
    var servers : [PMS] = []
    
    var gdmDiscoverRun = false
    static let TVBootURL = "http://localhost:9999/app.js"
    static let TVAppBaseURL = "http://localhost:9999/"
    
    var server: HttpServer = HttpServer();

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool
    {
        gdmDiscover()
        //Start the http server for our resources
        server = HttpServer()
        let resourceString = NSBundle.mainBundle().pathForResource("app", ofType: "js", inDirectory: "plexAssets")!.stringByReplacingOccurrencesOfString("app.js", withString: "")
        server["/servers"] = { request in
            var s = ""
            for var i = 0; i < self.servers.count; i++ {
                s += "{\"address\": \"\(self.servers[i].address)\", \"port\": \(self.servers[i].port) }"
                if i != (self.servers.count - 1) {
                    s += ","
                }
            }
            s = "[ \(s) ]"
            return .OK(.STRING(s))
        }
        server["/(.+)"] = HttpHandlers.directoryBrowser(resourceString)
        let error: NSErrorPointer = nil
        server.start(9999, error: error)
        window = UIWindow(frame: UIScreen.mainScreen().bounds)
        
        let appControllerContext = TVApplicationControllerContext()
        
        guard let javascriptUrl = NSURL(string: AppDelegate.TVBootURL) else {
            fatalError("Unable to create NSURL")
        }
        appControllerContext.javaScriptApplicationURL = javascriptUrl
        appControllerContext.launchOptions["TVAppBaseURL"] = AppDelegate.TVAppBaseURL
        
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        
        // Override point for customization after application launch.
        return true
    }
    
    func gdmDiscover() {
        
        let discoAddress = "239.0.0.250"
        let discoPort = UInt16(32414)
        let discoMessage = "M-SEARCH * HTTP/1.0".dataUsingEncoding(NSUTF8StringEncoding)!
        
        let socket = GCDAsyncUdpSocket(delegate: self, delegateQueue: dispatch_get_main_queue())
        do {
            try socket.bindToPort(discoPort)
            try socket.enableBroadcast(true)
            try socket.beginReceiving()
        }
        catch {
            print("Error caught \(error)")
            return;
        }
        socket.sendData(discoMessage, toHost: discoAddress, port: discoPort, withTimeout: 2, tag: 0)
    }
    
    func udpSocket(sock: GCDAsyncUdpSocket!, didReceiveData data: NSData!, fromAddress address: NSData!, withFilterContext filterContext: AnyObject!) {
        if let dat = data {
            if let str = String(data: dat, encoding: NSUTF8StringEncoding) {
                if str.containsString("plex/media-server") {
                    let parts = str.componentsSeparatedByString("\r\n")
                    for part in parts {
                        if part.containsString("Port:") {
                            let port = part.stringByReplacingOccurrencesOfString("Port: ", withString: "").stringByReplacingOccurrencesOfString("\r", withString: "")
                            var serverAddr :NSString?
                            GCDAsyncUdpSocket.getHost(&serverAddr, port: nil, fromAddress: address)
                            if let addr = serverAddr {
                                let server = PMS(address: addr as String, port: port)
                                servers.append(server)
                            }
                        }
                    }
                }
            }
        }
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

