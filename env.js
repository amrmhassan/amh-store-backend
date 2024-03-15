const variables = {
  NODE_ENV: 'production',
  PORT: 5000,
  db:
    'mongodb+srv://bahaabelala15:<password>@cluster0.pfwarq5.mongodb.net/?retryWrites=true&w=majority',
  jwtPrivateKey:
    'enf4>?yHotjgV|YDT-p6jEb<p&~_=Lqv3|yt4xO(Pm4b&m?OOSH16fj?foulxmsbhUV%MienI!&-pMdb8b+t!Zcw5?DgTqV=V_z)UR<b&SHbkR5!G|9Z42%E$Io-bdEcC)R+T!vN8T5eV>UZ!~.BCaP>O_soYGi~j<.)zzoUdW++swBAfb2V$~W.FA|%O4~PYtXt+sIIKc8c5!!e9KM6rx&(se3qrtpPQ#M1N=%o>#H@x4J~(Xwyb8Q7cQF(7UDuWO^V1Iw-uceIh*v#oore6#zC-atMD?Hg!^9CZEIjQ6=)L$|??5tfh)QhUYE?fiBhs?qI_1R.>ErgY_n).hLqPfvy/b+N6IbKS2Oj)rO_Qn)GwKwuAQ=HS463Xv<aP7%J_e%mSf/q|*sSy^Q$.K%br7f+/cZX4fKj%=yhDDnT2Iz.)8xz<!g)|U7@@rc+~swLNEMObe-MZKfp%GT2Wr=.4ZfIV4PkxnCY@26oz4g%(9IU-c3B_Nd@L2U)5)G@qR$OxjZ_U)u@Asxgv+oII<kYx1E/_$dSR2QlBjWP52)EQyFJ*QQo5iv/vUFK)Q?#7j8m-mQ8|ii6Vc!kg3w2iD>3x-)2cLS%!mr!fYLqI)i.RUpOe1PrY|+g6ij~|$i9LDV4/dmZu+.3_-j8jQ%G8?L2*bbq=*wf9DSSsa))YU(r^HZVv3oa5?trgdKH6umjY/NZ$l_s=Ye|Sa*KPPi|iuV|K*^*.H!IqZ%<mll#$/wPE_^9#)llYQyOfbdS%qw@Cj<qSXYH.gVwwt^Fzilh!s|3+lB(7cWVKKBA2x>HcLU4h*!A<S&N)fqk.QDerXFf_Vq)L>I)G-#t9VWoQ/@lR))omPwe(cJ@aRR)Z^oi%y7(^nFqR!utZ6>x_lGe9rZ8iWV)Syg(|oxViY$=w-g?&j^O/Hn@Dx(*OBWwb|@zciMCee7SULX4U5R9|h=<Ff52yEL3ftyh(HM4ZG9dim83hwG8+4zwd@d<)s9e>WVqIk)y ',
  db_Password: '9w0TWaDVK72rhsRU',
};

const keys = Object.keys(variables);
keys.forEach((key) => {
  process.env[key] = variables[key];
});
