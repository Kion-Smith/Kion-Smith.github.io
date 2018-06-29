/**
 * @(#)river.java
 *
 * river Applet application
 *
 * @author 
 * @version 1.00 2014/1/7
 */
 
import java.awt.*;
import java.applet.*;

public class river extends Applet {
	
	public void init() {
	}

	public void paint(Graphics g) {
		
		int x = 1;
		while(x==1)
		{
		
		Image background = getImage(getDocumentBase(),"Sceen.JPG");
		g.drawImage(background,0,0,this);
		
		Image Fish = getImage(getDocumentBase(),"Fish.JPG");
		
		
			g.drawImage(Fish,1000,500,this); 
		for(int i = 0 ; i< 900000000;i++);
		g.drawImage(background,0,0,this); 
			g.drawImage(Fish,900,500,this); 
		for(int i = 0 ; i< 900000000;i++);
		g.drawImage(background,0,0,this); 
		
		g.drawImage(Fish,800,500,this); 
		for(int i = 0 ; i< 900000000;i++);
		
		g.drawImage(background,0,0,this); 
			
		g.drawImage(Fish,700,500,this);
		for(int i = 0 ; i< 90000000;i++);
		
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,600,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,500,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,400,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,300,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,200,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,100,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,0,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		g.drawImage(Fish,-100,500,this);
		for(int i = 0 ; i< 90000000;i++);
		g.drawImage(background,0,0,this);
		
		 
			
		}	
	}
}